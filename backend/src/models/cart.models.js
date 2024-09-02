import mongoose from "mongoose";

// Create cartSchema
const cartSchema = new mongoose.Schema(
  {
    cartOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL"],
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
  },
  { timestamps: true,validateBeforeSave:true }
);
// NOTE: "validateBeforeSave: true" ensures that the mongoose built-in validation checks are enabled (it checks and enforces required values, enum values, min/max values etc. and throws errors)

// Create Cart model from cartSchema
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
