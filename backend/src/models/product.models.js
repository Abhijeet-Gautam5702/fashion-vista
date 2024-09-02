import mongoose from "mongoose";

// Create productSchema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    stock: {
      type: Boolean,
      default: true,
    },
    latestArrival: {
      type: Boolean,
      default: true,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    sizes: [
      {
        type: String,
        enum: ["XS", "S", "M", "L", "XL"],
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ["men", "women", "kids"],
    },
    fashionType: {
      type: String,
      enum: ["topwear", "bottomwear", "footwear", "formals", "ethnic"],
      required: true,
    },
    collection: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true, validateBeforeSave: true }
);
// NOTE: "validateBeforeSave: true" ensures that the mongoose built-in validation checks are enabled (it checks and enforces required values, enum values, min/max values etc. and throws errors)

// Create Product model from productSchema
const Product = mongoose.model("Product", productSchema);

export default Product;
