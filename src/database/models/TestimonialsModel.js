import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "", 
    },
    eventType: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
    },
    location: {
      type: String,
      
    },
    guests: {
      type: Number,
      min: 1,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    testimonial: {
      type: String,
      required: true,
    },
    vendorUsed: {
      type: String,
      
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);


if (mongoose.models.Testimonial) {
  delete mongoose.models.Testimonial;
}
const TestimonialModel = mongoose.model("Testimonial", testimonialSchema);

export default TestimonialModel;
