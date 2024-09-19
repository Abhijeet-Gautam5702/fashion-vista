import { Router } from "express";
import {
  authenticateAdmin,
  multerUpload,
  //testing
  // upload,
} from "../middlewares/index.js";
import {
  createAdminLoginSession,
  removeAdminLoginSession,
  getCurrentAdmin,
  deleteProductFromInventory,
  updateDeliveryStatusOfOrder,
  updateStockStatusOfProductInInventory,
  getAllOrders,
  addProductToInventory,
} from "../controllers/index.js";

const adminRouter = Router();

// Unsecured route
adminRouter.route("/create-admin-login-session").post(createAdminLoginSession);

// Secured routes
adminRouter
  .route("/remove-admin-login-session")
  .post(authenticateAdmin, removeAdminLoginSession);
adminRouter.route("/get-current-admin").get(authenticateAdmin, getCurrentAdmin);

adminRouter
  .route("/add-product-to-inventory")
  .post(authenticateAdmin, multerUpload, addProductToInventory);

adminRouter
  .route("/delete-product-from-inventory")
  .delete(authenticateAdmin, deleteProductFromInventory);

adminRouter
  .route("/update-product-stock-status")
  .put(authenticateAdmin, updateStockStatusOfProductInInventory);

adminRouter.route("/get-all-orders").get(authenticateAdmin, getAllOrders);

adminRouter
  .route("/update-order-status")
  .put(authenticateAdmin, updateDeliveryStatusOfOrder);

export default adminRouter;
