import mongoose from "mongoose";
import { Cart, Product } from "../models/index.js";
import {
  asyncController,
  CustomApiError,
  CustomApiResponse,
} from "../utilities/index.js";

// Unauthenticated route : Get all products of the inventory
// FEATURE ADD: Take a filter from the client and filter accordingly
const getAllProducts = asyncController(async (req, res, next) => {
  // Get all products from the database (sorted such that the latest added product is at the top)
  const productsFromDB = await Product.aggregate([
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ]);
  if (!productsFromDB.length) {
    throw new CustomApiError(404, `NO PRODUCTS IN THE INVENTORY`);
  }

  // Send response to the client
  res.json(
    new CustomApiResponse(200, `PRODUCTS FETCHED SUCCESSFULLY`, productsFromDB)
  );
});

// Unauthenticated route : Get current product
const getCurrentProduct = asyncController(async (req, res, next) => {
  // Get the productId from req.params
  const { productId } = req.params;
  if (!mongoose.isValidObjectId(productId)) {
    throw new CustomApiError(
      400,
      `COULD NOT FETCH CURRENT PRODUCT DETAILS || INVALID PRODUCT-ID`
    );
  }
  /*
      DIFFERENCE BETWEEN QUERY AND PARAMETERS
      - Queries are specified by the client in the http url whereas Parameters are set at the API routes.
      - Queries are used for filtering, sorting etc. whereas Parameters are used for getting information about certain parameters or routing.
      - We are using queries in `addProductToCart controller` because we want to send a particular product to the cart, so the client will send the productId as a query. On the other hand, we have used parameters for `getCurrentProduct controller` because we are fetching particular details about that product when user lands on its product page.
  */

  // Get the product details from database
  const productFromDB = await Product.findById(productId).select("-addedBy");
  if (!productFromDB) {
    throw new CustomApiError(404, `PRODUCT DETAILS NOT FOUND`);
  }

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(
        200,
        `PRODUCT DETAILS FETCHED SUCCESSFULLY`,
        productFromDB
      )
    );
});

// Authenticated route : Add a product to cart
const addProductToCart = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Get the productId, size and quantity from req.query
  const { size, quantity } = req.query;
  let { productId } = req.query;
  productId = new mongoose.Types.ObjectId(String(productId));
  if (!size) {
    throw new CustomApiError(
      400,
      `COULD NOT ADD PRODUCT TO CART || PRODUCT SIZE NOT KNOWN`
    );
  }
  if (!quantity) {
    throw new CustomApiError(
      400,
      `COULD NOT ADD PRODUCT TO CART || PRODUCT QUANTITY NOT KNOWN`
    );
  }
  if (!productId) {
    throw new CustomApiError(
      400,
      `COULD NOT ADD PRODUCT TO CART || PRODUCT-ID NOT FOUND`
    );
  }

  /*
        WHY USE `req.query` AND NOT `req.params`? DIFFERENCE BETWEEN QUERY AND PARAMETERS?
        
        - Queries are specified by the client in the http url whereas Parameters are set at the API routes.
        - Queries are used for filtering, sorting etc. whereas Parameters are used for getting information about certain parameters or routing.
        - We are using queries in `addProductToCart controller` because we want to send a particular product to the cart, so the client will send the productId as a query. On the other hand, we have used parameters for `getCurrentProduct controller` because we are fetching particular details about that product when user lands on its product page.
    */

  // Get the product details from the database
  const productFromDB = await Product.findById(productId);
  if (!productFromDB) {
    throw new CustomApiError(
      404,
      `COULD NOT ADD PRODUCT TO CART || PRODUCT NOT FOUND`
    );
  }

  // Check if a cart already exists for the logged-in user
  const userId = req.userData._id;
  const userCartFromDB = await Cart.findOne({ cartOwner: userId });

  let updatedCartFromDB = userCartFromDB;

  // Update the cart if it already exists
  if (userCartFromDB) {
    let isProductAlreadyPresentInCart = false;
    updatedCartFromDB.cartItems = userCartFromDB.cartItems.map((item) => {
      if (
        item.size === size &&
        item.product.toString() === productId.toString()
      ) {
        isProductAlreadyPresentInCart = true;
        item.quantity += Number(quantity);
      }
      return item;
    });
    if (!isProductAlreadyPresentInCart) {
      updatedCartFromDB.cartItems.push({ product: productId, size, quantity });
    }
    await updatedCartFromDB.save();
  }
  // Create a new cart with the current product
  else {
    updatedCartFromDB = await Cart.create({
      cartOwner: userId,
      cartItems: [
        {
          product: productId,
          size,
          quantity,
        },
      ],
    });
  }

  // Send response to the client
  res.json(
    new CustomApiResponse(
      200,
      `PRODUCT ADDED TO CART SUCCESSFULLY`,
      updatedCartFromDB
    )
  );
});

// Authenticated route : Remove a product from cart
const removeProductFromCart = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Get the productId,size from req.query
  let { productId, size } = req.query;
  if (!size) {
    throw new CustomApiError(
      404,
      `COULD NOT DELETE PRODUCT FROM CART || PRODUCT SIZE NOT PROVIDED`
    );
  }
  if (!productId) {
    throw new CustomApiError(
      404,
      `COULD NOT DELETE PRODUCT FROM CART || PRODUCT-ID NOT PROVIDED`
    );
  }
  productId = new mongoose.Types.ObjectId(String(productId));

  // Find the cart of the logged-in user from the database
  const userId = req.userData._id;
  let userCartFromDB = await Cart.findOne({ cartOwner: userId });
  if (!userCartFromDB) {
    throw new CustomApiError(
      404,
      `COULD NOT DELETE PRODUCT FROM CART || USER-CART NOT FOUND`
    );
  }

  // Delete specific product from the user cart
  userCartFromDB.cartItems = userCartFromDB.cartItems.filter(
    (item) => item.product !== productId && item.size !== size
  );
  await userCartFromDB.save();

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(
        200,
        `PRODUCT REMOVED FROM CART SUCCESSFULLY`,
        userCartFromDB
      )
    );
});

// Authenticated route : Update a product quantity in the cart
const updateProductQtInCart = asyncController(async (req, res, next) => {
  // Authenticate the user

  // Get the productId, size and quantity from req.query
  const { size, quantity } = req.query;
  let { productId } = req.query;
  productId = new mongoose.Types.ObjectId(String(productId));
  if (!size) {
    throw new CustomApiError(
      400,
      `COULD NOT UPDATE PRODUCT IN CART || PRODUCT SIZE NOT PROVIDED`
    );
  }
  if (!quantity) {
    throw new CustomApiError(
      400,
      `COULD NOT UPDATE PRODUCT IN CART || PRODUCT QUANTITY NOT PROVIDED`
    );
  }
  if (!productId) {
    throw new CustomApiError(
      400,
      `COULD NOT UPDATE PRODUCT IN CART || PRODUCT-ID NOT PROVIDED`
    );
  }

  /*
        WHY USE `req.query` AND NOT `req.params`? DIFFERENCE BETWEEN QUERY AND PARAMETERS?
        
        - Queries are specified by the client in the http url whereas Parameters are set at the API routes.
        - Queries are used for filtering, sorting etc. whereas Parameters are used for getting information about certain parameters or routing.
        - We are using queries in `addProductToCart controller` because we want to send a particular product to the cart, so the client will send the productId as a query. On the other hand, we have used parameters for `getCurrentProduct controller` because we are fetching particular details about that product when user lands on its product page.
    */

  // Get the product details from the database
  const productFromDB = await Product.findById(productId);
  if (!productFromDB) {
    throw new CustomApiError(
      404,
      `COULD NOT UPDATE PRODUCT IN CART || PRODUCT NOT FOUND IN DATABASE`
    );
  }

  // Check if a cart already exists for the logged-in user
  const userId = req.userData._id;
  const userCartFromDB = await Cart.findOne({ cartOwner: userId });
  if (!userCartFromDB) {
    throw new CustomApiError(
      404,
      `COULD NOT UPDATE PRODUCT IN CART || CART DOESN'T EXIST IN DATABASE`
    );
  }

  // Update the cart
  let isProductAlreadyPresentInCart = false;
  userCartFromDB.cartItems = userCartFromDB.cartItems.map((item) => {
    if (
      item.size === size &&
      item.product.toString() === productId.toString()
    ) {
      isProductAlreadyPresentInCart = true;
      item.quantity = Number(quantity);
    }
    return item;
  });
  if (!isProductAlreadyPresentInCart) {
    userCartFromDB.cartItems.push({ product: productId, size, quantity });
  }
  await userCartFromDB.save();

  // Send response to the client
  res.json(
    new CustomApiResponse(
      200,
      `PRODUCT QUANTITY UPDATED IN CART SUCCESSFULLY`,
      userCartFromDB
    )
  );
});

export {
  getAllProducts,
  getCurrentProduct,
  addProductToCart,
  removeProductFromCart,
  updateProductQtInCart,
};
