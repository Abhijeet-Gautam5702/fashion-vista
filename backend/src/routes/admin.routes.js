import { Router } from "express";
import { authenticateAdmin } from "../middlewares/index.js";
import { addProductToInventory } from "../controllers/index.js";

const adminRouter = Router();

// THIS IS JUST FOR TESTING (FOR THE TIME BEING)
// ADMIN CONTROLLERS AND ROUTERS NEED CHANGE
// POTENTIAL CHANGE: A SEPARATE LOGIN PAGE FOR ADMIN IN THE FRONTEND AND SEPARATE ADMIN-TOKENS WILL BE STORED IN THE COOKIES


// "/admin/inventory"

// "/admin/orders"

// "/admin/add-product"
// Secured route (Admin authentication required)
adminRouter
  .route("/add-product")
  .post(authenticateAdmin, addProductToInventory);

export default adminRouter;
