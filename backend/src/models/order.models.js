import mongoose from "mongoose";

// Create orderSchema
const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["placed", "packed", "shipped", "out for delivery", "delivered"],
      default: "placed",
    },
    orderDate: {
      type: Date,
      required: true,
    },
    orderValue: {
      type: Number,
      required: true,
      min: 10,
    },
    paymentMode: {
      type: String,
      enum: ["COD", "razorpay", "stripe"],
      default: "COD",
    },
    paymentStatus: {
      type: Boolean,
      default:false,
    },
    deliveryAddress: {
      type: String, // We will concatenate all the address lines (parts) from the frontend and send a single string to the backend
      required: true,
    },
    orderedItems: [
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
    placedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, validateBeforeSave: true }
);
// NOTE: "validateBeforeSave: true" ensures that the mongoose built-in validation checks are enabled (it checks and enforces required values, enum values, min/max values etc. and throws errors)

// Create Order model from orderSchema
const Order = mongoose.model("Order", orderSchema);

export default Order;
