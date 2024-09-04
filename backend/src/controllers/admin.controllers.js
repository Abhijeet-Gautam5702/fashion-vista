import { asyncController, CustomApiResponse } from "../utilities/index.js";
import { Product } from "../models/index.js";

// THIS IS JUST FOR TESTING (FOR THE TIME BEING)
// ADMIN CONTROLLERS AND ROUTERS NEED CHANGE
// POTENTIAL CHANGE: A SEPARATE LOGIN PAGE FOR ADMIN IN THE FRONTEND AND SEPARATE ADMIN-TOKENS WILL BE STORED IN THE COOKIES

// Authenticated route : Add a new product to the inventory
const addProductToInventory = asyncController(async (req, res, next) => {
  // Authenticate the admin
  // Get adminId from the req.admin object
  const adminId = req.adminData._id;
  console.log(adminId);

  const createdProduct = await Product.create(
    {
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
    }
  );

  res
    .status(200)
    .json(
      new CustomApiResponse(200, `PRODUCT ADDED TO INVENTORY`, createdProduct)
    );
});

export { addProductToInventory };
