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

  // AGGREGATION PIPELINES: Get the cart from the database and populate it with the product details
  const cartFromDB = await Cart.aggregate([
    // Filter the documents whose `cartOwner` field matches with userId
    {
      $match: {
        cartOwner: new mongoose.Types.ObjectId(String(userId)),
      },
    },
    // Unwind the `cartItems` array field
    /*
      WHAT DOES `$unwind` DO?
      While working with arrays, we have to destructure it into individual elements.
      Here, `$unwind` ungroups the cart-document into separate documents where everything remains the same but the `cartItems` field will now contain each cart-item object only.
    */
    {
      $unwind: {
        path: "$cartItems",
      },
    },
    // Populate the `cartItems.product` field of each (identical) cart-document with the product details "looked-up" from the "products" database
    {
      $lookup: {
        from: "products",
        localField: "cartItems.product",
        foreignField: "_id",
        as: "product",
        pipeline: [
          // Project only these fields
          {
            $project: {
              name: 1,
              description: 1,
              price: 1,
              stock: 1,
              images: 1,
              category: 1,
            },
          },
        ],
      },
    },
    // Unwind the `product` field (because the previous pipeline would return an array with one element only)
    {
      $unwind: "$product",
    },
    // Group the (so-called identical) cart-documents based on the cart-ID and accumulate each property
    {
      $group: {
        _id: "$_id", // group the documents based on this field
        // the `cartOwner` field will be populated by the first `cartOwner` field value of the group of documents
        /*
          DOUBT:
          `cartOwner` will remain same for each document then why are we specifying explicitly?

          EXPLANATION: 
          While re-grouping documents, every field has to be explicity "accumulated" (in MongoDB's language), even if we know that the values are the same/unique. Basically we need to specify how to handle each field explicitly when re-grouping.
        */
        cartOwner: {
          $first: "$cartOwner",
        },
        // Accumulate the `cartItems` field with the `product`, `size` & `quantity` fields
        cartItems: {
          $push: {
            product: "$product", // `product` field is present in the root of the document only
            size: "$cartItems.size", // `size` field is present in the `cartItems
            quantity: "$cartItems.quantity", // `quantity` field is present in the `cartItems
          },
        },
      },
    },
    // Project only certain fields
    {
      $project: {
        cartOwner: 1,
        cartItems: 1,
      },
    },
  ]);
  if (!cartFromDB) {
    throw new CustomApiError(404, `CART NOT FOUND IN DATABASE`);
  }

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(200, `CART FETCHED SUCCESSFULLY`, cartFromDB[0])
    );
});

// Authenticated route : Clear entire cart of the user
const clearCart = asyncController(async (req, res, next) => {
  // Authenticate the user
  console.log("here");

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
