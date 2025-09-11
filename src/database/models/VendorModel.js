import mongoose, { Schema, model, models } from "mongoose";

const VendorBaseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
    phoneNo: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
    },
    images: { type: [String], default: [] },
    defaultImage: { type: String },
    tags: { type: [String], default: [] },
    description: { type: String, maxlength: 2000 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    availableAreas: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    facilities: { type: [String], default: [] },
    contactPerson: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
    },
    planId: { type: Number, default: 1 },
    creditBalance: { type: Number, default: 10 },
  },
  { timestamps: true, discriminatorKey: "category" }
);

const Vendor = models.Vendor || model("Vendor", VendorBaseSchema);

const createDiscriminator = (name, schema) => {
    try {
        return models[name] || Vendor.discriminator(name, schema);
    } catch (e) {
        if (e.name === 'OverwriteModelError') {
            return models[name];
        }
        throw e;
    }
};

const VenueVendor = createDiscriminator('venues', new Schema({
    seating: { min: { type: Number }, max: { type: Number } },
    rooms: { min: { type: Number }, max: { type: Number } },
    parking: { type: Number },
    perDayPrice: { min: { type: Number, required: true }, max: { type: Number, required: true } },
}));

const PhotographerVendor = createDiscriminator('photographers', new Schema({
    services: [String],
    packages: [String],
    price: { min: Number, max: Number },
    delivery: Number,
}));

const MakeupVendor = createDiscriminator('makeup', new Schema({
    services: [String],
    brands: [String],
    price: { min: Number, max: Number },
    trial: Boolean,
}));

const PlannerVendor = createDiscriminator('planners', new Schema({
    services: [String],
    events: [String],
    experience: Number,
    fee: { min: Number, max: Number },
}));

const CatererVendor = createDiscriminator('catering', new Schema({
    cuisines: [String],
    menus: [String],
    price: { min: { type: Number, required: true }, max: { type: Number } },
    minOrder: Number,
}));

const ClothesVendor = createDiscriminator('clothes', new Schema({
    types: [String],
    price: { min: Number, max: Number },
    custom: Boolean,
}));

const MehendiVendor = createDiscriminator('mehendi', new Schema({
    types: [String],
    bridalPrice: { min: Number, max: Number },
    perHand: Number,
}));

const CakeVendor = createDiscriminator('cakes', new Schema({
    flavors: [String],
    priceKg: Number,
    minWeight: Number,
}));

const JewelleryVendor = createDiscriminator('jewellery', new Schema({
    types: [String],
    styles: [String],
    custom: Boolean,
}));

const InvitationVendor = createDiscriminator('invitations', new Schema({
    types: [String],
    price: { min: Number, max: Number },
    minOrder: Number,
}));

const DjVendor = createDiscriminator('djs', new Schema({
    genres: [String],
    price: { min: Number, max: Number },
    equipment: Boolean,
}));

const HairstylingVendor = createDiscriminator('hairstyling', new Schema({
    services: [String],
    price: { min: Number, max: Number },
    trial: Boolean,
}));

const OtherVendor = createDiscriminator('other', new Schema({
    name: { type: String, required: true },
    price: { min: Number, max: Number },
}));


export {
  Vendor,
  VenueVendor,
  PhotographerVendor,
  MakeupVendor,
  PlannerVendor,
  CatererVendor,
  ClothesVendor,
  MehendiVendor,
  CakeVendor,
  JewelleryVendor,
  InvitationVendor,
  DjVendor,
  HairstylingVendor,
  OtherVendor,
};

export default Vendor;
