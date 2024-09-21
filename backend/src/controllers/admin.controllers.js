import { User, Product, Order } from "../models/index.js";
import {
  asyncController,
  CustomApiError,
  CustomApiResponse,
  uploadImageToCloudinary,
} from "../utilities/index.js";
import {
  ZodEmailSchema,
  ZodPasswordSchema,
  ZodProductCollectionTypeSchema,
  ZodProductFashionTypeSchema,
  ZodProductCategorySchema,
  ZodProductSizesSchema,
  ZodProductPriceSchema,
  ZodProductDescriptionSchema,
  ZodProductNameSchema,
  ZodOrderStatusSchema,
} from "../schema/zod.schema.js";
import mongoose from "mongoose";

// Admin-Cookie Options
const cookieOptions = {
  httpOnly: true, // prevents client-side JS to access/read the cookies
  secure: true, // ensures that cookies are sent via HTTPS only
  sameSite: "none", // allows the cookies to be sent to different domains (resolves CORS issues)
  path: "/admin/", // determines which paths (in the browser URL) can access the cookies
};

// Unauthenticated route : Create a new login session for the admin
const createAdminLoginSession = asyncController(async (req, res, next) => {
  // Get user credentials from req.body
  const { email, password } = req.body;

  // Validate the data
  const isEmailValid = ZodEmailSchema.safeParse(email);
  const isPasswordValid = ZodPasswordSchema.safeParse(password);

  if (!isEmailValid.success) {
    throw new CustomApiError(400, "INVALID EMAIL", isEmailValid.error.issues);
  }
  if (!isPasswordValid.success) {
    throw new CustomApiError(
      400,
      "INVALID PASSWORD",
      isPasswordValid.error.issues
    );
  }

  // Check if the user is present in the database
  const adminFromDB = await User.findOne({ email });
  if (!adminFromDB) {
    throw new CustomApiError(
      404,
      `ADMIN LOGIN FAILED || ADMIN NOT FOUND IN THE DATABASE`
    );
  }

  // Match the password
  const isPasswordMatched = await adminFromDB.matchPassword(password);
  if (!isPasswordMatched) {
    throw new CustomApiError(401, `ADMIN LOGIN FAILED || INCORRECT PASSWORD`);
  }

  // Check if the user has admin permissions
  if (!adminFromDB.adminPermission) {
    throw new CustomApiError(
      401,
      `ADMIN LOGIN FAILED || USER IS NOT AUTHORIZED AS ADMIN`
    );
  }

  // Generate tokens
  const adminAccessToken = adminFromDB.createAccessToken();
  const adminRefreshToken = adminFromDB.createRefreshToken();

  // Set refresh token to the user document in database
  const updatedAdminFromDB = await User.findOneAndUpdate(
    { email },
    { refreshToken: adminRefreshToken },
    { new: true } // return the updated document
  );

  // Exclude sensitive information from the updated user document
  /*
    MINIMIZE THE NUMBER OF DATABASE CALLS
    - If the user document would have been successfully created => "newUser" will have all the data. So simply create a new object and include only those fields that are required to be sent to the client.
    - If the user document was not created successfully => it will throw an error and will automatically be handled by asyncController catch-block
  */
  const selectedFields = [
    "_id",
    "name",
    "email",
    "adminPermission",
    "refreshToken",
  ];
  let adminData = {};
  selectedFields.forEach((field) => {
    adminData[field] = updatedAdminFromDB[field];
  });

  // Send response to the client and set cookies
  res
    .status(200)
    .cookie("adminRefreshToken", adminRefreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .cookie("adminAccessToken", adminAccessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      data: new CustomApiResponse(
        200,
        `LOGIN SESSION CREATED SUCCESSFULLY`,
        adminData
      ).data,
      adminAccessToken,
    });
});

// Authenticated route : Remove the login session of the admin
const removeAdminLoginSession = asyncController(async (req, res, next) => {
  // Auth Middleware: Check if the admin is logged in (i.e. authenticated)

  // Get the adminId of the logged-in admin & remove the refresh token from the user-document in the database
  const adminId = req.adminData._id;
  const updatedAdminFromDB = await User.findByIdAndUpdate(
    adminId,
    { refreshToken: "" },
    { new: true } // return the updated document
  );

  // Exclude sensitive information from the updated user document
  /*
    MINIMIZE THE NUMBER OF DATABASE CALLS
    - If the user document would have been successfully created => "newUser" will have all the data. So simply create a new object and include only those fields that are required to be sent to the client.
    - If the user document was not created successfully => it will throw an error and will automatically be handled by asyncController catch-block
  */
  const selectedFields = ["name", "email", "adminPermission"];
  let adminData = {};
  selectedFields.forEach((field) => {
    adminData[field] = updatedAdminFromDB[field];
  });

  // Clear all the tokens from the cookie and send response to the client
  res
    .status(200)
    .clearCookie("adminAccessToken", cookieOptions)
    .clearCookie("adminRefreshToken", cookieOptions)
    .json(
      new CustomApiResponse(
        200,
        `LOGIN SESSION REMOVED SUCCESSFULLY`,
        adminData
      )
    );
});

// Authenticated route : Get the current logged-in admin
const getCurrentAdmin = asyncController(async (req, res, next) => {
  // Auth Middleware: Check if the admin is logged in (i.e. authenticated)

  // Get the admin details of the logged-in admin from the database (using the adminId)
  const adminData = req.adminData;

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(
        200,
        `ADMIN DETAILS FETCHED SUCCESSFULLY`,
        adminData
      )
    );
});

// Authenticated route : Add a new product to the inventory
const addProductToInventory = asyncController(async (req, res, next) => {
  // Auth Middleware: Check if the admin is logged in (i.e. authenticated)

  const adminId = req.adminData._id;
  if (!adminId) {
    throw new CustomApiError(
      404,
      `COULD NOT ADD PRODUCT TO INVENTORY || ADMIN-ID NOT PROVIDED`
    );
  }

  // Get the product details from req.body
  const {
    name,
    description,
    category,
    fashionType,
    bestSeller,
    latestArrival,
    stock,
  } = req.body;
  const price = Number(req.body.price);
  const sizes = req.body.sizes;
  const collectionType = req.body.collectionType;
  /*
    REMEMBER WHILE TESTING IN POSTMAN
    While Testing in Postman, every data is being sent in form of a JSON, hence it must be parsed back to JS native data types here.
    However, while using axios in the frontend, no need to parse the data as it is handled and converted automatically by axios
  */

  // Validate the product details
  const isProductNameValid = ZodProductNameSchema.safeParse(name);
  const isProductDescriptionValid =
    ZodProductDescriptionSchema.safeParse(description);
  const isProductPriceValid = ZodProductPriceSchema.safeParse(price);
  const isProductSizesValid = ZodProductSizesSchema.safeParse(sizes);
  const isProductCategoryValid = ZodProductCategorySchema.safeParse(category);
  const isProductFashionTypeValid =
    ZodProductFashionTypeSchema.safeParse(fashionType);
  const isProductCollectionTypeValid =
    ZodProductCollectionTypeSchema.safeParse(collectionType);

  if (!isProductNameValid.success) {
    throw new CustomApiError(
      400,
      `INVALID FORMAT OF PRODUCT NAME`,
      isProductNameValid.error.issues
    );
  }
  if (!isProductDescriptionValid.success) {
    throw new CustomApiError(
      400,
      `INVALID FORMAT OF PRODUCT DESCRIPTION`,
      isProductDescriptionValid.error.issues
    );
  }
  if (!isProductPriceValid.success) {
    throw new CustomApiError(
      400,
      `INVALID FORMAT OF PRODUCT PRICE`,
      isProductPriceValid.error.issues
    );
  }
  if (!isProductSizesValid.success) {
    throw new CustomApiError(
      400,
      `INVALID FORMAT OF PRODUCT SIZES`,
      isProductSizesValid.error.issues
    );
  }
  if (!isProductCategoryValid.success) {
    throw new CustomApiError(
      400,
      `INVALID FORMAT OF PRODUCT CATEGORY`,
      isProductCategoryValid.error.issues
    );
  }
  if (!isProductFashionTypeValid.success) {
    throw new CustomApiError(
      400,
      `INVALID FORMAT OF PRODUCT FASHION TYPE`,
      isProductFashionTypeValid.error.issues
    );
  }
  if (!isProductCollectionTypeValid.success) {
    throw new CustomApiError(
      400,
      `INVALID FORMAT OF PRODUCT COLLECTION TYPE`,
      isProductCollectionTypeValid.error.issues
    );
  }

  // Get the files from req.files
  // Note: Multer stores the fieldname as "image[]" as mentioned in multer-configuration
  if (!req.files["image[]"]) {
    throw new CustomApiError(
      404,
      `PRODUCT IMAGES UPLOAD FAILED || NO FILES STORED IN THE SERVER || SOMETHING WRONG WITH THE FORM-DATA`
    );
  }
  const localFiles = req.files["image[]"];
  /*
      NOTE: 
      We cannot directly map the array and push the urls (returned from cloudinary-uploader function) to an array. This is because array.map/filter/forEach are synchronous methods and do not wait for the async operations to complete.

      So we do the following:-
      - Store the promises into an array (named `promises`)
      - Resolve all promises at once (using `Promise.all()`)
      - Destructure the array of resolved promises and store them in an array (`imageURLs`)
    */
  const promises = await localFiles.map(async (file) => {
    const res = await uploadImageToCloudinary(file.path);
    return res.secure_url;
  }); // Store the promises into an array (named `promises`)
  const resolvedPromises = await Promise.all(promises); //Resolve all promises at once (using `Promise.all()`)
  const imageURLs = [...resolvedPromises]; //Destructure the array of resolved promises and store them in an array (`imageURLs`)

  // Create a new product in the database
  const createdProduct = await Product.create({
    name,
    description,
    price,
    images: imageURLs,
    stock,
    latestArrival: latestArrival || false,
    bestSeller: bestSeller || false,
    sizes,
    category,
    fashionType,
    collectionType,
    tags: [category, fashionType, ...collectionType],
    addedBy: adminId,
  });
  if (!createdProduct) {
    throw new CustomApiError(
      500,
      `PRODUCT COULD NOT BE ADDED TO THE INVENTORY || PRODUCT-DOCUMENT CREATION FAILED`
    );
  }

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(
        200,
        `PRODUCT SUCCESSFULLY ADDED TO INVENTORY`,
        createdProduct
      )
    );
});

// Authenticated route : Delete a product from the inventory
const deleteProductFromInventory = asyncController(async (req, res, next) => {
  // Authenticate the admin

  // Get the productId from req.query
  let productId = req.query.productId;
  if (!productId) {
    throw new CustomApiError(
      404,
      `PRODUCT DELETION FROM INVENTORY FAILED || PRODUCT-ID NOT PROVIDED`
    );
  }
  productId = new mongoose.Types.ObjectId(String(productId)); // Convert to Mongoose ObjectId
  if (!mongoose.isValidObjectId(productId)) {
    throw new CustomApiError(
      400,
      `PRODUCT DELETION FROM INVENTORY FAILED || INVALID PRODUCT-ID PROVIDED`
    );
  }

  // Delete the product from the database
  const deletedProductFromDB = await Product.findByIdAndDelete(productId);
  if (!deletedProductFromDB) {
    throw new CustomApiError(
      500,
      `PRODUCT DELETION FROM INVENTORY FAILED || PRODUCT-DOCUMENT COULD NOT BE DELETED FROM THE DATABASE`
    );
  }

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(
        200,
        `PRODUCT SUCCESSFULLY DELETED FROM THE INVENTORY`,
        deletedProductFromDB
      )
    );
});

// Authenticated route : Update the stock status of a product in the inventory
const updateStockStatusOfProductInInventory = asyncController(
  async (req, res, next) => {
    // Authenticate the admin

    // Get the productId from the req.query
    let productId = req.query.productId;
    if (!productId) {
      throw new CustomApiError(
        404,
        `PRODUCT UPDATION FAILED || PRODUCT-ID NOT PROVIDED`
      );
    }
    productId = new mongoose.Types.ObjectId(String(productId)); // Convert to Mongoose ObjectId
    if (!mongoose.isValidObjectId(productId)) {
      throw new CustomApiError(
        400,
        `PRODUCT UPDATION FAILED || INVALID PRODUCT-ID PROVIDED`
      );
    }

    // Check if the product exists in the database
    const productFromDB = await Product.findById(productId);
    if (!productFromDB) {
      throw new CustomApiError(
        404,
        `PRODUCT UPDATION FAILED || PRODUCT NOT FOUND IN THE DATABASE`
      );
    }

    // Update the product stock status in the database
    const updatedProductFromDB = await Product.findByIdAndUpdate(
      productId,
      {
        stock: !productFromDB.stock,
      },
      { new: true }
    );
    if (!updatedProductFromDB) {
      throw new CustomApiError(
        400,
        `PRODUCT UPDATION FAILED || PRODUCT DOCUMENT WAS NOT ABLE TO UPDATE`
      );
    }

    // Send response to the client
    res
      .status(200)
      .json(
        new CustomApiResponse(
          200,
          `PRODUCT STOCK STATUS SUCCESSFULLY UPDATED`,
          updatedProductFromDB
        )
      );
  }
);

const getAllOrders = asyncController(async (req, res, next) => {
  // Authenticate the admin

  // Get the order documents from the database sorted such that the latest order (according to creation date) is at the top
  const allOrdersFromDB = await Order.aggregate([
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
          {
            $project: {
              _id: 1,
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
        placedBy: {
          $first: "$placedBy",
        },
        createdAt: {
          $first: "$createdAt",
        },
        updatedAt: {
          $first: "$updatedAt",
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
  if (!allOrdersFromDB) {
    throw new CustomApiError(
      400,
      `ORDERS COULD NOT BE FETCHED FROM THE DATABASE`
    );
  }

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(
        200,
        "ALL ORDERS FETCHED SUCCESSFULLY",
        allOrdersFromDB
      )
    );
});

// Authenticated route : Change delivery status of a placed order
const updateDeliveryStatusOfOrder = asyncController(async (req, res, next) => {
  // Authenticate the admin

  // Get the orderId and newOrderStatus from req.query
  let orderId = req.query.orderId;
  if (!orderId) {
    throw new CustomApiError(
      404,
      `ORDER STATUS COULD NOT BE CHANGED || PRODUCT-ID NOT PROVIDED`
    );
  }
  orderId = new mongoose.Types.ObjectId(String(orderId)); // Convert to Mongoose ObjectId
  if (!mongoose.isValidObjectId(orderId)) {
    throw new CustomApiError(
      400,
      `ORDER STATUS COULD NOT BE CHANGED || INVALID PRODUCT-ID PROVIDED`
    );
  }
  let newOrderStatus = String(req.query.newOrderStatus);
  if (!newOrderStatus) {
    throw new CustomApiError(
      400,
      `ORDER STATUS COULD NOT BE CHANGED || UPDATED-ORDER-STATUS NOT PROVIDED`
    );
  }
  const isNewOrderStatusValid = ZodOrderStatusSchema.safeParse(newOrderStatus);
  if (!isNewOrderStatusValid.success) {
    throw new CustomApiError(
      400,
      `ORDER STATUS COULD NOT BE CHANGED || UPDATED-ORDER-STATUS IS INVALID`,
      isNewOrderStatusValid.error.issues
    );
  }

  // Find the order-document in the database and update its order-status
  const orderFromDB = await Order.findById(orderId);
  if (!orderFromDB) {
    throw new CustomApiError(
      404,
      `ORDER STATUS COULD NOT BE CHANGED || ORDER-DOCUMENT NOT FOUND IN THE DATABASE`
    );
  }
  orderFromDB.status = newOrderStatus;
  await orderFromDB.save();

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(
        200,
        `ORDER STATUS SUCCESSFULLY UPDATED`,
        orderFromDB
      )
    );
});

export {
  createAdminLoginSession,
  removeAdminLoginSession,
  getCurrentAdmin,
  deleteProductFromInventory,
  updateStockStatusOfProductInInventory,
  updateDeliveryStatusOfOrder,
  getAllOrders,
  addProductToInventory,
};
