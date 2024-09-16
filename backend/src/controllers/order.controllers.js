import { Cart, Order } from "../models/index.js";
import {
  asyncController,
  CustomApiError,
  CustomApiResponse,
} from "../utilities/index.js";
import {
  ZodAddressSchema,
  ZodEmailSchema,
  ZodPhoneNumberSchema,
} from "../schema/zod.schema.js";
import mongoose from "mongoose";

// Authenticated route : Get order history
const getOrderHistory = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Get the userId from req.userData
  const userId = req.userData._id;

  // AGGREGATION PIPELINES: Get the orders list, group them by the userID and populate it with the ordered-products' details
  const orderFromDB = await Order.aggregate([
    // Filter the order documents whose `placedBy` matches with userId
    {
      $match: {
        placedBy: new mongoose.Types.ObjectId(String(userId)),
      },
    },
    // Unwind the `orderItems` field
    {
      $unwind: {
        path: "$orderedItems",
      },
    },
    // Populate the `orderedItems.product` field with product details looked-up from "products" collection
    {
      $lookup: {
        from: "products",
        localField: "orderedItems.product",
        foreignField: "_id",
        as: "product",
        pipeline: [
          // Project only these fields
          {
            $project: {
              name: 1,
              images: 1,
              category: 1,
            },
          },
        ],
      },
    },
    // Unwind the `product` field (as the previous stage would have returned an array with single element)
    {
      $unwind: {
        path: "$product",
      },
    },
    // Group the identical documents based on the "_id"
    {
      $group: {
        _id: "$_id",
        // accumulate other fields of your choice into the final grouped document
        orderedItems: {
          $push: {
            product: "$product",
            size: "$orderedItems.size",
            quantity: "$orderedItems.quantity",
          },
        },
        status: {
          $first: "$status",
        },
        orderDate: {
          $first: "$orderDate",
        },
        orderValue: {
          $first: "$orderValue",
        },
        paymentMode: {
          $first: "$paymentMode",
        },
        paymentStatus: {
          $first: "$paymentStatus",
        },
        deliveryAddress: {
          $first: "$deliveryAddress",
        },
      },
    },
    // Sort the documents based on the descending order of `orderDate` field (so that latest order is at the top)
    {
      $sort: {
        orderDate: -1,
      },
    },
  ]);
  if (!orderFromDB.length) {
    throw new CustomApiError(404, `ORDER NOT FOUND IN THE DATABASE`);
  }

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(200, `ORDERS FETCHED SUCCESSFULLY`, orderFromDB)
    );
});

// Authenticated route : Place an order
const placeOrder = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Get the shipping details from req.body and validate them
  const { address, phone, email, orderValue } = req.body;
  const isAddressValid = ZodAddressSchema.safeParse(address);
  const isPhoneValid = ZodPhoneNumberSchema.safeParse(phone);
  const isEmailValid = ZodEmailSchema.safeParse(email);
  if (!isEmailValid.success) {
    throw new CustomApiError(
      400,
      `ORDER COULD NOT BE PLACED || INVALID EMAIL ADDRESS`,
      isAddressValid.error.issues
    );
  }
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

  // AGGREGATION PIPELINES: Get the created order and populate it with the ordered-products' details
  const createdOrder = await Order.aggregate([
    // Filter the order documents whose `_id` matches with "order._id"
    {
      $match: {
        // _id: new mongoose.Types.ObjectId(String(order._id)),
        _id: new mongoose.Types.ObjectId(order._id),
      },
    },
    // Unwind the `orderItems` field
    {
      $unwind: {
        path: "$orderedItems",
      },
    },
    // Populate the `orderedItems.product` field with product details looked-up from "products" collection
    {
      $lookup: {
        from: "products",
        localField: "orderedItems.product",
        foreignField: "_id",
        as: "product",
        pipeline: [
          // Project only these fields
          {
            $project: {
              name: 1,
              images: 1,
              category: 1,
            },
          },
        ],
      },
    },
    // Unwind the `product` field (as the previous stage would have returned an array with single element)
    {
      $unwind: {
        path: "$product",
      },
    },
    // Group the identical documents based on the "_id"
    {
      $group: {
        _id: "$_id",
        // accumulate other fields of your choice into the final grouped document
        orderedItems: {
          $push: {
            product: "$product",
            size: "$orderedItems.size",
            quantity: "$orderedItems.quantity",
          },
        },
        status: {
          $first: "$status",
        },
        orderDate: {
          $first: "$orderDate",
        },
        orderValue: {
          $first: "$orderValue",
        },
        paymentMode: {
          $first: "$paymentMode",
        },
        paymentStatus: {
          $first: "$paymentStatus",
        },
        deliveryAddress: {
          $first: "$deliveryAddress",
        },
      },
    },
    // Sort the documents based on the descending order of `orderDate` field (so that latest order is at the top)
    {
      $sort: {
        orderDate: -1,
      },
    },
  ]);
  if (!createdOrder.length) {
    throw new CustomApiError(404, `ORDER NOT FOUND IN THE DATABASE`);
  }

  // Clear the user's cart
  const clearCart = await Cart.findByIdAndDelete(userCartFromDB._id);
  if (!clearCart) {
    throw new CustomApiError(
      500,
      `COULD NOT CLEAR CART FROM DATABASE || SOMETHING WENT WRONG AT OUR END`
    );
  }

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(200, `ORDER PLACED SUCCESSFULLY`, createdOrder[0])
    );
});

// Authenticated route : Cancel an order
const cancelOrder = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Send response to the client
  res.json({});
});

export { placeOrder, cancelOrder, getOrderHistory };
