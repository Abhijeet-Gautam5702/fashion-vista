import mongoose from "mongoose";
import { Cart, Product } from "../models/index.js";
import {
  asyncController,
  CustomApiError,
  CustomApiResponse,
} from "../utilities/index.js";

// Authenticated route : Get the cart of the current user
const getCart = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Get the userId from req.userData
  const userId = req.userData._id;

  // Get the cart from the database
  const cartFromDB = await Cart.findOne({ cartOwner: userId });
  if (!cartFromDB) {
    throw new CustomApiError(404, `CART NOT FOUND IN DATABASE`);
  }

  // Send response to the client
  res
    .status(200)
    .json(new CustomApiResponse(200, `CART FETCHED SUCCESSFULLY`, cartFromDB));
});

// Authenticated route : Clear entire cart of the user
const clearCart = asyncController(async (req, res, next) => {
  // Authenticate the user
  console.log("here")

  // Get the userId from req.userData
  const userId = req.userData._id;

  // Find the cart in the database
  const cartFromDB = await Cart.findOne({ cartOwner: userId });
  if (!cartFromDB) {
    throw new CustomApiError(
      404,
      `CART COULD NOT BE DELETED || CART NOT FOUND IN THE DATABASE`
    );
  }

  // Delete the  cart from the database
  const deletedCart = await Cart.findOneAndDelete({ cartOwner: userId });

  // Send response to the client
  res
    .status(200)
    .json(new CustomApiResponse(200, `CART CLEARED SUCCESSFULLY`, null));
});

export { getCart, clearCart };
