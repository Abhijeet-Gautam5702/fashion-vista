import { Cart, Order } from "../models/index.js";
import {
  asyncController,
  CustomApiError,
  CustomApiResponse,
} from "../utilities/index.js";
import {
  ZodAddressSchema,
  ZodPhoneNumberSchema,
} from "../schema/zod.schema.js";
import mongoose from "mongoose";

// Authenticated route : Get order history
const getOrderHistory = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Send response to the client
  res.json({});
});

// Authenticated route : Place an order
const placeOrder = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Get the shipping details from req.body and validate them
  const { address, phone } = req.body;
  const isAddressValid = ZodAddressSchema.safeParse(address);
  const isPhoneValid = ZodPhoneNumberSchema.safeParse(phone);
  if (!isAddressValid.success) {
    throw new CustomApiError(
      400,
      `ORDER COULD NOT BE PLACED || INVALID SHIPPING ADDRESS`,
      isAddressValid.error.issues
    );
  }
  if (!isPhoneValid.success) {
    throw new CustomApiError(
      400,
      `ORDER COULD NOT BE PLACED || INVALID PHONE NUMBER`,
      isPhoneValid.error.issues
    );
  }

  // Get the current user cart from the database
  const userId = req.userData._id;
  const userCartFromDB = await Cart.findOne({ cartOwner: userId });
  if (!userCartFromDB) {
    throw new CustomApiError(
      404,
      `ORDER COULD NOT BE PLACED || CART DOESN'T EXIST IN THE DATABASE`
    );
  }
  const orderValue = 10;

  const order = await Order.create({
    deliveryAddress: address,
    orderedItems: userCartFromDB.cartItems,
    placedBy: userId,
    orderDate: new Date(),
    paymentMode: "COD",
    paymentStatus: false,
    orderValue,
  });
  if (!order) {
    throw new CustomApiError(
      500,
      `ORDER COULD NOT BE PLACED || SOMETHING WENT WRONG AT OUR END`
    );
  }

  // Clear the user's cart
  const clearCart = await Cart.findByIdAndDelete(userCartFromDB._id);
  if (!clearCart) {
    throw new CustomApiError(
      500,
      `COULD NOT DELETE CART FROM DATABASE || SOMETHING WENT WRONG AT OUR END`
    );
  }

  // Send response to the client
  res
    .status(200)
    .json(new CustomApiResponse(200, `ORDER PLACED SUCCESSFULLY`, order));
});

// Authenticated route : Cancel an order
const cancelOrder = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Send response to the client
  res.json({});
});

export { placeOrder, cancelOrder, getOrderHistory };
