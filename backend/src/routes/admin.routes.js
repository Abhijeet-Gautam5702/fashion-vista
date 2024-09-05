import { Router } from "express";
import { authenticateAdmin } from "../middlewares/index.js";
import {
  addProductToInventory, // FOR TESTING
  createAdminLoginSession,
  removeAdminLoginSession,
  getCurrentAdmin,
  addNewProductToInventory,
  deleteProductFromInventory,
  updateDeliveryStatusOfOrder,
} from "../controllers/index.js";

const adminRouter = Router();

// Unsecured route
adminRouter.route("/create-admin-login-session").post(createAdminLoginSession);

// Secured routes
adminRouter
  .route("/remove-admin-login-session")
  .delete(authenticateAdmin, removeAdminLoginSession);
adminRouter.route("/get-current-admin").get(authenticateAdmin, getCurrentAdmin);
adminRouter
  .route("/add-new-product-to-inventory")
  .post(authenticateAdmin, addNewProductToInventory);
adminRouter
  .route("/delete-product-from-inventory")
  .delete(authenticateAdmin, deleteProductFromInventory);
adminRouter
  .route("/update-order-status")
  .put(authenticateAdmin, updateDeliveryStatusOfOrder);

// FOR TESTING
adminRouter
  .route("/add-product")
  .post(authenticateAdmin, addProductToInventory);

export default adminRouter;
