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

// THIS IS JUST FOR TESTING (FOR THE TIME BEING)
// ADMIN CONTROLLERS AND ROUTERS NEED CHANGE
// POTENTIAL CHANGE: A SEPARATE LOGIN PAGE FOR ADMIN IN THE FRONTEND AND SEPARATE ADMIN-TOKENS WILL BE STORED IN THE COOKIES

// TESTING ONLY!! ===> Authenticated route : Add a new product to the inventory
const addProductToInventory = asyncController(async (req, res, next) => {
  // Authenticate the admin
  // Get adminId from the req.admin object
  const adminId = req.adminData._id;
  console.log(adminId);

  const createdProduct = await Product.create({
    name: "test product",
    description: "test description",
    price: 20.5,
    stock: true,
    latestArrival: true,
    sizes: ["XS", "L", "M"],
    category: "men",
    fashionType: "topwear",
    collectionType: ["winter", "sports"],
    addedBy: adminId,
  });

  res
    .status(200)
    .json(
      new CustomApiResponse(200, `PRODUCT ADDED TO INVENTORY`, createdProduct)
    );
});

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
  const selectedFields = ["name", "email", "adminPermission", "refreshToken"];
  let adminData = {};
  selectedFields.forEach((field) => {
    adminData[field] = updatedAdminFromDB[field];
  });

  // Send response to the client and set cookies
  res
    .status(200)
    .cookie("adminRefreshToken", adminRefreshToken, {
      httpOnly: true,
      secure: true,
    })
    .cookie("adminAccessToken", adminAccessToken, {
      httpOnly: true,
      secure: true,
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
    .clearCookie("adminAccessToken", {
      httpOnly: true,
      secure: true,
    })
    .clearCookie("adminRefreshToken", {
      httpOnly: true,
      secure: true,
    })
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
const addNewProductToInventory = asyncController(async (req, res, next) => {
  // Auth Middleware: Check if the admin is logged in (i.e. authenticated)

  const adminId = req.adminData._id;
  if (!adminId) {
    throw new CustomApiError(
      404,
      `COULD NOT ADD PRODUCT TO INVENTORY || ADMIN-ID NOT PROVIDED`
    );
  }

  // Get the product details from req.body
  const { name, description, category, fashionType } = req.body;
  const price = JSON.parse(req.body.price);
  const sizes = JSON.parse(req.body.sizes); // Parse to convert into JS-array
  const collectionType = JSON.parse(req.body.collectionType); // Parse to convert into JS-array

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

  // Get the images uploaded by the client
  // Upload the images on Cloudinary and delete images from the server
  // Get the Cloudinary links of the uploaded images

  // Create a new product in the database
  const createdProduct = await Product.create({
    name,
    description,
    price: price,
    images: [], // Populate this with Cloudinary links later
    stock: true,
    latestArrival: true,
    sizes,
    category,
    fashionType,
    collectionType,
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

// Authenticated route : Add images of a product in the inventory
const addImagesOfProductInInventory = asyncController(
  async (req, res, next) => {
    // Authenticate the admin

    // Get the productId from req.query
    let productId = req.query.productId;
    if (!productId) {
      throw new CustomApiError(
        404,
        `PRODUCT IMAGES UPLOAD FAILED || PRODUCT-ID NOT PROVIDED`
      );
    }
    productId = new mongoose.Types.ObjectId(String(productId)); // Convert to mongoose ObjectId
    if (!mongoose.isValidObjectId(productId)) {
      throw new CustomApiError(
        400,
        `PRODUCT IMAGES UPLOAD FAILED || INVALID PRODUCT-ID PROVIDED`
      );
    }

    // Check if the product exists in the database
    const productFromDB = await Product.findById(productId);
    if (!productFromDB) {
      throw new CustomApiError(
        404,
        `PRODUCT IMAGES UPLOAD FAILED || PRODUCT-DOCUMENT NOT FOUND IN THE DATABASE`
      );
    }

    // Get the files from req.files
    if (!req.files["product_images"]) {
      throw new CustomApiError(
        404,
        `PRODUCT IMAGES UPLOAD FAILED || NO FILES STORED IN THE SERVER || SOMETHING WRONG WITH THE FORM-DATA`
      );
    }
    const localFiles = req.files["product_images"];

    // Upload the files to Cloudinary
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

    // Store the Cloudinary image-URLs to the product-document in the database
    productFromDB.images = imageURLs;
    await productFromDB.save();

    // Send response to the client
    res
      .status(200)
      .json(
        new CustomApiResponse(
          200,
          `PRODUCT IMAGES SUCCESSFULLY UPLOADED`,
          productFromDB
        )
      );
  }
);

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
  addProductToInventory,
  createAdminLoginSession,
  removeAdminLoginSession,
  getCurrentAdmin,
  addNewProductToInventory,
  deleteProductFromInventory,
  updateDeliveryStatusOfOrder,
  addImagesOfProductInInventory,
};
